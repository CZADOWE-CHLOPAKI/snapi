"""Remove old item model

Revision ID: 6a51c3fefda5
Revises: 142302e29928
Create Date: 2024-06-28 11:50:03.122809

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '6a51c3fefda5'
down_revision = '142302e29928'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('item')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('item',
    sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('owner_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], name='item_owner_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='item_pkey')
    )
    # ### end Alembic commands ###
